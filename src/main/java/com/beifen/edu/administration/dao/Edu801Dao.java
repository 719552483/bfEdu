package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu801;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

@Configuration
public interface Edu801Dao extends JpaRepository<Edu801, Long>, JpaSpecificationExecutor<Edu801> {
    //根据所属二级学院查询所有调查问卷
    @Query(value = "select * from edu801 where PERMISSIONS in ?1 or PERMISSIONS = 'all'",nativeQuery = true)
    List<Edu801> searchAllQuestionByUserId(List<String> list);
}
