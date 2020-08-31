package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu204;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface Edu204Dao extends JpaRepository<Edu204, Long>, JpaSpecificationExecutor<Edu204> {

    //根据任务书删除行政班关联信息
    @Transactional
    @Modifying
    @Query(value = "delete from edu204 where Edu201_ID =?1", nativeQuery = true)
    void removeByEdu201Id(String edu201_id);

    @Query(value = "select e.Edu300_ID from edu204 e where e.Edu201_ID =?1", nativeQuery = true)
    List<String> searchEdu300IdByEdu201Id(String edu201ID);
}
