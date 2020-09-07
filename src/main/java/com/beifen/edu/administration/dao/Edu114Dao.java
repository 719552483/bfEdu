package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu114;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


public interface Edu114Dao extends JpaRepository<Edu114, Long>, JpaSpecificationExecutor<Edu114> {

    // 根据id集合删除班主任日志
    @Transactional
    @Modifying
    @Query(value = "delete from edu114 where Edu114_ID in ?1", nativeQuery = true)
    void deleteByEdu114IdList(List<String> deleteIdList);
}


